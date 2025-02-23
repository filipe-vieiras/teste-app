import React, { useState, useEffect } from 'react';
import { Card, TextInput, Button, Textarea } from 'flowbite-react';
import { supabase } from '../supabase';

const initialCanvasState = {
  id: null,
  title: 'New Canvas',
  problem: '',
  solution: '',
  uniqueValue: '',
  unfairAdvantage: '',
  customerSegments: '',
  existingAlternatives: '',
  keyMetrics: '',
  highLevelConcept: '',
  channels: '',
  costStructure: '',
  revenueStreams: ''
};

export default function LeanCanvas() {
  const [canvases, setCanvases] = useState([]);
  const [currentCanvas, setCurrentCanvas] = useState(initialCanvasState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCanvases();
  }, []);

  const fetchCanvases = async () => {
    const { data, error } = await supabase
      .from('lean_canvases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching canvases:', error);
    } else {
      setCanvases(data || []);
      if (data && data.length > 0) {
        setCurrentCanvas(data[0]);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentCanvas(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const { id, ...canvasData } = currentCanvas;
    if (id) {
      const { error } = await supabase
        .from('lean_canvases')
        .update(canvasData)
        .eq('id', id);
      if (error) console.error('Error updating canvas:', error);
    } else {
      const { error } = await supabase
        .from('lean_canvases')
        .insert([canvasData]);
      if (error) console.error('Error creating canvas:', error);
    }
    setIsEditing(false);
    fetchCanvases();
  };

  const handleDelete = async () => {
    if (!currentCanvas.id) return;
    const { error } = await supabase
      .from('lean_canvases')
      .delete()
      .eq('id', currentCanvas.id);
    if (error) {
      console.error('Error deleting canvas:', error);
    } else {
      setCurrentCanvas(initialCanvasState);
      fetchCanvases();
    }
  };

  const createNewCanvas = () => {
    setCurrentCanvas(initialCanvasState);
    setIsEditing(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <TextInput
              value={currentCanvas.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-64"
            />
          ) : (
            <h2 className="text-2xl font-bold">{currentCanvas.title}</h2>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
          <Button onClick={createNewCanvas}>New Canvas</Button>
          {currentCanvas.id && (
            <Button color="failure" onClick={handleDelete}>Delete</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-1">
          <h3 className="font-bold mb-2">Problem</h3>
          <Textarea
            value={currentCanvas.problem}
            onChange={(e) => handleInputChange('problem', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-1">
          <h3 className="font-bold mb-2">Solution</h3>
          <Textarea
            value={currentCanvas.solution}
            onChange={(e) => handleInputChange('solution', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-1">
          <h3 className="font-bold mb-2">Unique Value Proposition</h3>
          <Textarea
            value={currentCanvas.uniqueValue}
            onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-1">
          <h3 className="font-bold mb-2">Unfair Advantage</h3>
          <Textarea
            value={currentCanvas.unfairAdvantage}
            onChange={(e) => handleInputChange('unfairAdvantage', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-1">
          <h3 className="font-bold mb-2">Customer Segments</h3>
          <Textarea
            value={currentCanvas.customerSegments}
            onChange={(e) => handleInputChange('customerSegments', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-1">
          <h3 className="font-bold mb-2">Existing Alternatives</h3>
          <Textarea
            value={currentCanvas.existingAlternatives}
            onChange={(e) => handleInputChange('existingAlternatives', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-1">
          <h3 className="font-bold mb-2">Key Metrics</h3>
          <Textarea
            value={currentCanvas.keyMetrics}
            onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-1">
          <h3 className="font-bold mb-2">High Level Concept</h3>
          <Textarea
            value={currentCanvas.highLevelConcept}
            onChange={(e) => handleInputChange('highLevelConcept', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-1">
          <h3 className="font-bold mb-2">Channels</h3>
          <Textarea
            value={currentCanvas.channels}
            onChange={(e) => handleInputChange('channels', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-2">
          <h3 className="font-bold mb-2">Cost Structure</h3>
          <Textarea
            value={currentCanvas.costStructure}
            onChange={(e) => handleInputChange('costStructure', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>

        <Card className="col-span-3">
          <h3 className="font-bold mb-2">Revenue Streams</h3>
          <Textarea
            value={currentCanvas.revenueStreams}
            onChange={(e) => handleInputChange('revenueStreams', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </Card>
      </div>

      {canvases.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Saved Canvases</h3>
          <div className="flex gap-2 flex-wrap">
            {canvases.map(canvas => (
              <Button
                key={canvas.id}
                onClick={() => {
                  setCurrentCanvas(canvas);
                  setIsEditing(false);
                }}
                color={currentCanvas.id === canvas.id ? 'blue' : 'gray'}
              >
                {canvas.title}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}